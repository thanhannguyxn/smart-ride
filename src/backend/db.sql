CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Passengers (
    passenger_id INT PRIMARY KEY,
    default_payment_method_id INT,
    passenger_rating DECIMAL(3,2),
    FOREIGN KEY (passenger_id) REFERENCES Users(user_id) 
);

CREATE TABLE Drivers (
    driver_id INT PRIMARY KEY,
    license_number VARCHAR(50) NOT NULL,
    vehicle_details VARCHAR(255),
    driver_rating DECIMAL(3,2),
    active_status BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (driver_id) REFERENCES Users(user_id) 
);

CREATE TABLE PaymentMethods (
    payment_method_id INT PRIMARY KEY AUTO_INCREMENT,
    payment_type ENUM('CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL', 'CASH') NOT NULL,
    card_number VARCHAR(255),
    expiry_date VARCHAR(10),
    card_holder_name VARCHAR(100),
    passenger_id INT NOT NULL,
    FOREIGN KEY (passenger_id) REFERENCES Passengers(passenger_id) ON DELETE CASCADE
);

CREATE TABLE RideRequests (
    request_id INT PRIMARY KEY AUTO_INCREMENT,
    passenger_id INT NOT NULL,
    pickup_location_id INT NOT NULL,
    dropoff_location_id INT NOT NULL,
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('PENDING', 'ACCEPTED', 'CANCELLED', 'COMPLETED') DEFAULT 'PENDING',

    FOREIGN KEY (passenger_id) REFERENCES Passengers(passenger_id),
    FOREIGN KEY (pickup_location_id) REFERENCES Locations(location_id),
    FOREIGN KEY (dropoff_location_id) REFERENCES Locations(location_id),
    FOREIGN KEY (route_id) REFERENCES Routes(route_id),
    FOREIGN KEY (rate_id) REFERENCES Rates(rate_id)
);

CREATE TABLE Rides (
    ride_id INT PRIMARY KEY AUTO_INCREMENT,
    request_id INT NOT NULL,
    driver_id INT NOT NULL,
    actual_pickup_time TIMESTAMP,
    actual_dropoff_time TIMESTAMP, 
    status ENUM('IN_PROGRESS', 'COMPLETED', 'CANCELLED') DEFAULT 'IN_PROGRESS',
    current_location_id INT,
    FOREIGN KEY (request_id) REFERENCES RideRequests(request_id),
    FOREIGN KEY (driver_id) REFERENCES Drivers(driver_id),
    FOREIGN KEY (current_location_id) REFERENCES Locations(location_id)
);

CREATE TABLE Invoices (
    invoice_id INT PRIMARY KEY AUTO_INCREMENT,
    ride_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method_id INT,
    payment_status ENUM('PENDING', 'PAID', 'FAILED') DEFAULT 'PENDING',
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ride_id) REFERENCES Rides(ride_id),
    FOREIGN KEY (payment_method_id) REFERENCES PaymentMethods(payment_method_id)
);

CREATE TABLE Managers (
    manager_id INT PRIMARY KEY,
    FOREIGN KEY (manager_id) REFERENCES Users(user_id)
);


CREATE TABLE Notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    type ENUM('RIDE_UPDATE', 'PAYMENT', 'ALERT', 'INFO') DEFAULT 'INFO',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Rates (
    rate_id INT PRIMARY KEY AUTO_INCREMENT,
    ride_id INT,
    driver_id INT,
    passenger_id INT,
    rating DECIMAL(3,2) NOT NULL,
    comment VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ride_id) REFERENCES Rides(ride_id),
    FOREIGN KEY (driver_id) REFERENCES Drivers(driver_id),
    FOREIGN KEY (passenger_id) REFERENCES Passengers(passenger_id) 
);

CREATE TABLE Reports (
    report_id INT PRIMARY KEY AUTO_INCREMENT,
    manager_id INT NOT NULL,
    report_type VARCHAR(50),
    parameters TEXT,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    report_data TEXT,
    FOREIGN KEY (manager_id) REFERENCES Managers(manager_id)
);

CREATE TABLE Locations (
    location_id INT PRIMARY KEY AUTO_INCREMENT,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    address VARCHAR(255)
);

CREATE TABLE Routes (
    route_id INT PRIMARY KEY AUTO_INCREMENT,
    start_location INT,
    end_location INT,
    distance DECIMAL(10,2),
    estimated_time INT,
    FOREIGN KEY (start_location) REFERENCES Locations(location_id),
    FOREIGN KEY (end_location) REFERENCES Locations(location_id)
);
