use employees;

INSERT INTO department
    (name)
VALUES
    ('Sales'),
    ('Engineers'),
    ('Accounting'),
    ('Human Resources');

INSERT INTO role
(title, salary, department_id)
VALUES
('Sales Person', 25000, 1),
('Engineer', 75000, 2),
('HR Manager', 50000, 4),
('Customer Service', 100000, 1),
('Engineering Manager', 55000, 2),
('Lawyer', 100000, 4),
('Accountant', 100000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Timmy', 'Tom', 1, NULL),
('Jimmy', 'John', 3, 1),
('Pete', 'Peterson', 4, NULL),
('Tyler', 'Taylor', 1, 2),
('Jenny', 'Penny', 2, NULL);