-- ROUTES TABLE
CREATE TABLE routes (
    id SERIAL PRIMARY KEY,
    route_id VARCHAR(10) UNIQUE NOT NULL,
    vessel_type VARCHAR(50) NOT NULL,
    fuel_type VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    ghg_intensity FLOAT NOT NULL,         -- gCO₂e/MJ
    fuel_consumption FLOAT NOT NULL,      -- tonnes
    distance_km FLOAT NOT NULL,
    total_emissions FLOAT NOT NULL,
    is_baseline BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- SHIP COMPLIANCE TABLE
CREATE TABLE ship_compliance (
    id SERIAL PRIMARY KEY,
    ship_id VARCHAR(20) NOT NULL,
    year INT NOT NULL,
    cb_gco2eq FLOAT NOT NULL,             -- Compliance balance in gCO₂e
    created_at TIMESTAMP DEFAULT NOW()
);

-- BANK ENTRIES TABLE
CREATE TABLE bank_entries (
    id SERIAL PRIMARY KEY,
    ship_id VARCHAR(20) NOT NULL,
    year INT NOT NULL,
    amount_gco2eq FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- POOLS TABLE
CREATE TABLE pools (
    id SERIAL PRIMARY KEY,
    year INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- POOL MEMBERS TABLE
CREATE TABLE pool_members (
    id SERIAL PRIMARY KEY,
    pool_id INT NOT NULL REFERENCES pools(id) ON DELETE CASCADE,
    ship_id VARCHAR(20) NOT NULL,
    cb_before FLOAT NOT NULL,
    cb_after FLOAT NOT NULL
);