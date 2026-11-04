import sqlite3
import os

db_path = os.path.abspath('database/chanakya_campus.db')
con = sqlite3.connect(db_path)
cur = con.cursor()

cols = [r[1] for r in cur.execute('PRAGMA table_info(experiment_runs)').fetchall()]
print('Existing cols in experiment_runs:', cols)
for col_name, col_type in [
    ('latency_samples_json', 'TEXT'),
    ('histogram_bins_json', 'TEXT'),
    ('repetition_index', 'INTEGER DEFAULT 1'),
    ('is_median_run', 'BOOLEAN DEFAULT 1'),
    ('workload_details_json', 'TEXT')
]:
    if col_name not in cols:
        cur.execute(f'ALTER TABLE experiment_runs ADD COLUMN {col_name} {col_type}')
        print(f'Added {col_name} to experiment_runs')

rcols = [r[1] for r in cur.execute('PRAGMA table_info(architecture_ratings)').fetchall()]
print('Existing cols in architecture_ratings:', rcols)
for col_name, col_type in [
    ('winner', 'VARCHAR(50) DEFAULT "Modular Monolith (A)"'),
    ('evaluation_method', 'VARCHAR(100) DEFAULT "Empirical Benchmark"'),
    ('scoring_rubric', 'TEXT'),
    ('evidence_metrics', 'TEXT')
]:
    if col_name not in rcols:
        cur.execute(f'ALTER TABLE architecture_ratings ADD COLUMN {col_name} {col_type}')
        print(f'Added {col_name} to architecture_ratings')

con.commit()
con.close()
print('Migration complete!')
