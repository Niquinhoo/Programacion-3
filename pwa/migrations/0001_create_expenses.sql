CREATE TABLE IF NOT EXISTS expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL CHECK(length(name) BETWEEN 1 AND 100),
  amount REAL NOT NULL CHECK(amount > 0),
  category TEXT NOT NULL CHECK(category IN ('Alimentos', 'Transporte', 'Servicios', 'Otros')),
  date TEXT NOT NULL,
  notes TEXT CHECK(notes IS NULL OR length(notes) <= 1000)
);
