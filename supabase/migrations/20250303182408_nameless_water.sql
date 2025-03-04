-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    state VARCHAR(50) NOT NULL DEFAULT 'backlog',
    priority INTEGER NOT NULL DEFAULT 3,
    assignee UUID REFERENCES users(id),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    author UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create columns table
CREATE TABLE IF NOT EXISTS columns (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    position INTEGER NOT NULL
);

-- Insert default columns
INSERT INTO columns (id, title, position) VALUES
    ('backlog', 'Бэклог', 1),
    ('inprogress', 'В работе', 2),
    ('aprove', 'На подтверждении', 3),
    ('done', 'Завершено', 4);

-- Create default admin user (username: admin, password: admin)
INSERT INTO users (username, email, password, role) 
VALUES ('admin', 'admin@example.com', '$2a$10$3euPcmQFCiblsZeEu5s7p.9wUWR.1h3XYSKJPZjMU9.NUuf5.BX8a', 'admin')
ON CONFLICT (email) DO NOTHING;