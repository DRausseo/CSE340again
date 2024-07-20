-- 1. insertion into accounts 
INSERT INTO public.account (account_firstname, account_lastname, email, account_password)
VALUES ('Tony', 'Stark','tony@starkent.com', 'Iam1ronM@n')


-- 2. Modifying the the account type to admin
UPDATE public.account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark'


-- 3. Deleting the database for tony from the records 
DELETE FROM public.account
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark'


-- 4. modify the description to be huge interior instaed of amall interior
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- 5. catergorising cars to sports section
SELECT i.inv_make, i.inv_model, c.classification_name
FROM public.inventory i
INNER JOIN public.classification c
ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';


-- 6 Adding all records to add /vehicles to file path
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');