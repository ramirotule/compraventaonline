-- ========================================
-- COMPRAVENTA ONLINE - ESQUEMA DE BASE DE DATOS
-- ========================================

-- Habilitar extensiones necesarias
create extension if not exists "uuid-ossp";

-- ========================================
-- TABLA: profiles (perfiles de usuarios)
-- ========================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  nombre text not null,
  apellido text not null,
  dni text unique not null,
  telefono text not null,
  fecha_nacimiento date not null,
  direccion text not null,
  ciudad text not null,
  provincia text not null,
  codigo_postal text not null,
  avatar_url text,
  verificado boolean default false,
  activo boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Constraints
  constraint dni_format check (dni ~ '^[0-9]{7,8}$'),
  constraint codigo_postal_format check (codigo_postal ~ '^[0-9]{4,8}$')
);

-- ========================================
-- TABLA: productos
-- ========================================
create table public.productos (
  id uuid default uuid_generate_v4() primary key,
  titulo text not null,
  descripcion text not null,
  precio decimal(12,2) not null,
  categoria text not null,
  estado text not null,
  provincia text not null,
  ciudad text not null,
  codigo_postal text not null,
  ubicacion text not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  imagenes text[] default '{}',
  activo boolean default true,
  destacado boolean default false,
  visitas integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Constraints
  constraint precio_positivo check (precio > 0),
  constraint titulo_longitud check (char_length(titulo) >= 5 and char_length(titulo) <= 100),
  constraint descripcion_longitud check (char_length(descripcion) >= 20 and char_length(descripcion) <= 2000),
  constraint categoria_valida check (categoria in ('Electrónica', 'Vehículos', 'Hogar', 'Deportes', 'Moda', 'Libros', 'Música', 'Otros')),
  constraint estado_valido check (estado in ('Nuevo', 'Como nuevo', 'Muy bueno', 'Bueno', 'Regular'))
);

-- ========================================
-- TABLA: favoritos
-- ========================================
create table public.favoritos (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  producto_id uuid references public.productos(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Evitar duplicados
  unique(user_id, producto_id)
);

-- ========================================
-- TABLA: mensajes (para chat entre usuarios)
-- ========================================
create table public.mensajes (
  id uuid default uuid_generate_v4() primary key,
  producto_id uuid references public.productos(id) on delete cascade not null,
  remitente_id uuid references public.profiles(id) on delete cascade not null,
  destinatario_id uuid references public.profiles(id) on delete cascade not null,
  mensaje text not null,
  leido boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Constraints
  constraint mensaje_no_vacio check (char_length(trim(mensaje)) > 0),
  constraint no_self_message check (remitente_id != destinatario_id)
);

-- ========================================
-- TABLA: conversaciones (para agrupar mensajes)
-- ========================================
create table public.conversaciones (
  id uuid default uuid_generate_v4() primary key,
  producto_id uuid references public.productos(id) on delete cascade not null,
  comprador_id uuid references public.profiles(id) on delete cascade not null,
  vendedor_id uuid references public.profiles(id) on delete cascade not null,
  ultimo_mensaje_at timestamp with time zone default timezone('utc'::text, now()) not null,
  activa boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Evitar conversaciones duplicadas
  unique(producto_id, comprador_id, vendedor_id)
);

-- ========================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ========================================

-- Índices para productos
create index productos_user_id_idx on public.productos(user_id);
create index productos_categoria_idx on public.productos(categoria);
create index productos_provincia_ciudad_idx on public.productos(provincia, ciudad);
create index productos_precio_idx on public.productos(precio);
create index productos_created_at_idx on public.productos(created_at desc);
create index productos_activo_idx on public.productos(activo) where activo = true;

-- Índices para favoritos
create index favoritos_user_id_idx on public.favoritos(user_id);
create index favoritos_producto_id_idx on public.favoritos(producto_id);

-- Índices para mensajes
create index mensajes_conversacion_idx on public.mensajes(producto_id, remitente_id, destinatario_id);
create index mensajes_created_at_idx on public.mensajes(created_at desc);
create index mensajes_no_leidos_idx on public.mensajes(destinatario_id, leido) where leido = false;

-- ========================================
-- FUNCIONES Y TRIGGERS
-- ========================================

-- Función para actualizar updated_at automáticamente
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Triggers para updated_at
create trigger handle_updated_at_profiles
  before update on public.profiles
  for each row execute procedure handle_updated_at();

create trigger handle_updated_at_productos
  before update on public.productos
  for each row execute procedure handle_updated_at();

-- Función para crear perfil automáticamente cuando se registra un usuario
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, nombre, apellido, dni, telefono, fecha_nacimiento, direccion, ciudad, provincia, codigo_postal)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'nombre', ''),
    coalesce(new.raw_user_meta_data->>'apellido', ''),
    coalesce(new.raw_user_meta_data->>'dni', ''),
    coalesce(new.raw_user_meta_data->>'telefono', ''),
    coalesce(new.raw_user_meta_data->>'fecha_nacimiento', '1990-01-01')::date,
    coalesce(new.raw_user_meta_data->>'direccion', ''),
    coalesce(new.raw_user_meta_data->>'ciudad', ''),
    coalesce(new.raw_user_meta_data->>'provincia', ''),
    coalesce(new.raw_user_meta_data->>'codigo_postal', '')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger para crear perfil automáticamente
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================

-- Habilitar RLS en todas las tablas
alter table public.profiles enable row level security;
alter table public.productos enable row level security;
alter table public.favoritos enable row level security;
alter table public.mensajes enable row level security;
alter table public.conversaciones enable row level security;

-- ========================================
-- POLÍTICAS DE SEGURIDAD
-- ========================================

-- Políticas para profiles
create policy "Los usuarios pueden ver todos los perfiles públicos"
  on public.profiles for select
  using (true);

create policy "Los usuarios pueden actualizar su propio perfil"
  on public.profiles for update
  using (auth.uid() = id);

-- Políticas para productos
create policy "Todos pueden ver productos activos"
  on public.productos for select
  using (activo = true);

create policy "Los usuarios pueden crear sus propios productos"
  on public.productos for insert
  with check (auth.uid() = user_id);

create policy "Los usuarios pueden actualizar sus propios productos"
  on public.productos for update
  using (auth.uid() = user_id);

create policy "Los usuarios pueden eliminar sus propios productos"
  on public.productos for delete
  using (auth.uid() = user_id);

-- Políticas para favoritos
create policy "Los usuarios pueden ver sus propios favoritos"
  on public.favoritos for select
  using (auth.uid() = user_id);

create policy "Los usuarios pueden agregar favoritos"
  on public.favoritos for insert
  with check (auth.uid() = user_id);

create policy "Los usuarios pueden eliminar sus propios favoritos"
  on public.favoritos for delete
  using (auth.uid() = user_id);

-- Políticas para mensajes
create policy "Los usuarios pueden ver mensajes donde participan"
  on public.mensajes for select
  using (auth.uid() = remitente_id or auth.uid() = destinatario_id);

create policy "Los usuarios pueden enviar mensajes"
  on public.mensajes for insert
  with check (auth.uid() = remitente_id);

create policy "Los usuarios pueden marcar como leídos sus mensajes"
  on public.mensajes for update
  using (auth.uid() = destinatario_id);

-- Políticas para conversaciones
create policy "Los usuarios pueden ver sus conversaciones"
  on public.conversaciones for select
  using (auth.uid() = comprador_id or auth.uid() = vendedor_id);

create policy "Los usuarios pueden crear conversaciones como compradores"
  on public.conversaciones for insert
  with check (auth.uid() = comprador_id);

-- ========================================
-- STORAGE BUCKET PARA IMÁGENES
-- ========================================

-- Crear bucket para imágenes de productos
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true);

-- Política de storage: cualquiera puede ver las imágenes
create policy "Cualquiera puede ver las imágenes de productos"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Política de storage: usuarios autenticados pueden subir imágenes
create policy "Usuarios autenticados pueden subir imágenes"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

-- Política de storage: los usuarios pueden actualizar sus propias imágenes
create policy "Los usuarios pueden actualizar sus propias imágenes"
  on storage.objects for update
  using (bucket_id = 'product-images' and auth.uid()::text = (storage.foldername(name))[1]);

-- Política de storage: los usuarios pueden eliminar sus propias imágenes
create policy "Los usuarios pueden eliminar sus propias imágenes"
  on storage.objects for delete
  using (bucket_id = 'product-images' and auth.uid()::text = (storage.foldername(name))[1]);

-- ========================================
-- DATOS DE EJEMPLO (OPCIONAL)
-- ========================================

-- Insertar algunas categorías como comentario para referencia:
-- Categorías disponibles: 'Electrónica', 'Vehículos', 'Hogar', 'Deportes', 'Moda', 'Libros', 'Música', 'Otros'
-- Estados disponibles: 'Nuevo', 'Como nuevo', 'Muy bueno', 'Bueno', 'Regular'