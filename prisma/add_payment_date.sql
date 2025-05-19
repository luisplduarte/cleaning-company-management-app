-- Add payment_date column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'ClientPayment' 
        AND column_name = 'payment_date'
    ) THEN
        ALTER TABLE "ClientPayment" 
        ADD COLUMN payment_date TIMESTAMP;
    END IF;
END $$;
