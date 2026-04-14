-- D1 数据库表结构
DROP TABLE IF EXISTS work_records;

CREATE TABLE work_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client TEXT NOT NULL,
  req TEXT,
  total DECIMAL(10,2),
  paid DECIMAL(10,2),
  paidStatus TEXT,
  prodStatus TEXT,
  processStatus TEXT DEFAULT 'pending',
  board TEXT,
  address TEXT,
  contact TEXT,
  note TEXT,
  date TEXT,
  delivery TEXT
);

-- 创建索引
CREATE INDEX idx_processStatus ON work_records(processStatus);
CREATE INDEX idx_date ON work_records(date);