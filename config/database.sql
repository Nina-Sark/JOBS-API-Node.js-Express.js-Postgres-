CREATE DATABASE "PG-JOBS"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

CREATE TABLE users
(
    user_id SERIAL,
    email VARCHAR UNIQUE NOT NULL,
    password VARCHAR(15) NOT NULL,
    first_name VARCHAR(25) NOT NULL,
    last_name VARCHAR(25) NOT NULL,
    role VARCHAR DEFAULT 'Freelancer',
    rating DECIMAL DEFAULT 0,
    number_of_reviews DECIMAL DEFAULT 0,
    
    CONSTRAINT PK_user_id PRIMARY KEY (user_id),
    CONSTRAINT CHK_user_role CHECK (role = 'Freelancer' OR role = 'Employer'),
    CONSTRAINT CHK_user_rating CHECK (rating <= 5 AND rating > 0)
);

CREATE INDEX user_id_idx ON users (user_id)

CREATE TABLE profile_details
(
    profile_id SERIAL,
    user_id SERIAL,
    field_of_expertise VARCHAR(100) NOT NULL,
    description VARCHAR(700) NOT NULL,
    age INTEGER NOT NULL,
    gender VARCHAR NOT NULL,
    country VARCHAR NOT NULL,
    city VARCHAR NOT NULL,
    state VARCHAR DEFAULT 'not defined',
    postal_code INTEGER NOT NULL,
    
    CONSTRAINT PK_profile_id PRIMARY KEY (profile_id),
    CONSTRAINT FK_profile_user_id FOREIGN KEY (user_id) REFERENCES users (user_id),
    CONSTRAINT CHK_user_age CHECK (age > 10 AND age < 90),
    CONSTRAINT CHK_user_gender CHECK (gender = 'F' OR gender = 'M')
);

CREATE INDEX profile_details_id_idx ON profile_details (profile_id)
CREATE INDEX profile_details_user_idx ON profile_details (user_id)

CREATE TABLE jobs
(
    job_id SERIAL,
    employer_id SERIAL,
    job_title VARCHAR(200) NOT NULL,
    job_description VARCHAR(700) NOT NULL,
    required_skills TEXT[] NOT NULL,
    job_price DECIMAL[] NOT NULL,
    number_of_bids INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT PK_job_id PRIMARY KEY (job_id),
    CONSTRAINT FJ_job_employer_id FOREIGN KEY (employer_id) REFERENCES users (user_id),
    CONSTRAINT CHK_job_job_price CHECK (array_length(job_price, 1) = 2)
);

ALTER TABLE jobs
ADD CONSTRAINT CHK_job_price_range CHECK(job_price[1] < job_price[2])

CREATE INDEX jobs_id_idx ON jobs (job_id)
CREATE INDEX jobs_employer_id_idx ON jobs (employer_id)

CREATE TABLE bids
(
    bid_id SERIAL,
    user_id SERIAL,
    job_id SERIAL,
    bid_description VARCHAR (700) NOT NULL,
    bid_price DECIMAL NOT NULL,
    bid_timeline INTEGER DEFAULT 7,
    created_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT PK_bid_id PRIMARY KEY (bid_id),
    CONSTRAINT FK_bid_user_id FOREIGN KEY (user_id) REFERENCES users (user_id),
    CONSTRAINT FK_bid_job_id FOREIGN KEY (job_id) REFERENCES jobs (job_id)
);

CREATE INDEX bid_id_idx ON bids (bid_id)
CREATE INDEX bid_job_id_idx ON bids (job_id)

CREATE TABLE reviews
(
    review_id SERIAL,
    reviewer_id SERIAL,
    user_id SERIAL,
    job_id SERIAL,
    review_description VARCHAR(250) NOT NULL,
    rating DECIMAL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT PK_review_id PRIMARY KEY (review_id),
    CONSTRAINT FK_reviewer_id FOREIGN KEY (reviewer_id) REFERENCES users (user_id),
    CONSTRAINT FK_review_user_id FOREIGN KEY (user_id) REFERENCES users (user_id),
    CONSTRAINT FK_review_job_id FOREIGN KEY (job_Id) REFERENCES jobs (job_id),
    CONSTRAINT CHK_review_rating CHECK (rating > 0  AND rating <= 5)
);

ALTER TABLE users
ALTER COLUMN password SET DATA TYPE varchar;

ALTER TABLE users
DROP CONSTRAINT CHK_user_rating;

ALTER TABLE users
ADD CONSTRAINT CHK_user_rating CHECK (rating <= 5 AND rating >= 0);

CREATE OR REPLACE PROCEDURE update_job (job INTEGER, employer INTEGER, title VARCHAR, description VARCHAR, skills TEXT[], price DECIMAL[])
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE jobs
  SET job_title = title, job_description = description, required_skills = skills, job_price = price
  WHERE job_id = job AND employer_id = employer;
END;
$$;

CREATE OR REPLACE PROCEDURE delete_job (job INTEGER, employer INTEGER)
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM jobs
  WHERE job_id = job AND employer_id = employer;
  
  DELETE FROM bids
  WHERE job_id = job;
END;
$$;

CREATE OR REPLACE FUNCTION post_bid
(
    job INTEGER, 
    freelancer INTEGER,
    description VARCHAR,
    price DECIMAL,
    timeline INTEGER DEFAULT 7
) 
RETURNS SETOF bids AS $$
DECLARE
bids_number INTEGER;
BEGIN

SELECT number_of_bids INTO bids_number
FROM jobs
WHERE job_id = job;

UPDATE jobs
SET number_of_bids = bids_number + 1
WHERE job_id = job;

RETURN QUERY
INSERT INTO bids (user_id, job_id, bid_description, bid_price, bid_timeline) 
VALUES (freelancer, job, description, price, timeline) 
RETURNING *;

END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION remove_bid
(
    job INTEGER, 
    freelancer INTEGER,
    bid INTEGER
) 
RETURNS SETOF bids AS $$
DECLARE
bids_number INTEGER;
BEGIN

SELECT number_of_bids INTO bids_number
FROM jobs
WHERE job_id = job;

UPDATE jobs
SET number_of_bids = bids_number - 1
WHERE job_id = job;

RETURN QUERY
DELETE FROM bids
WHERE job_id = job AND user_id = freelancer AND bid_id = bid
RETURNING *;

END;
$$ LANGUAGE plpgsql;