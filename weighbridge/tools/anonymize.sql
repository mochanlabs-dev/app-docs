-- Turns a COPY of a Weighbridge database into a safe demo database for documentation screenshots:
-- every customer / vehicle / user / ledger name, phone and address is replaced with invented ones, and all
-- transactions, audit trails and outbox history are removed (the capture script then creates fresh demo
-- transactions through the app). Run ONLY against a throwaway copy, never a real database.
SET NOCOUNT ON;
SET QUOTED_IDENTIFIER ON;

-- ---- parties ------------------------------------------------------------------------------------------
;WITH n AS (SELECT ID, ROW_NUMBER() OVER (ORDER BY ID) AS rn FROM Party)
UPDATE p SET
    CName = CASE WHEN n.rn = 1 THEN 'Cash' ELSE CHOOSE(1 + (n.rn % 24),
        'Himalaya Builders','Sharma Constructions','Kumar Traders','Gayatri Contractors','Singh Infra Projects',
        'Rudra Enterprises','Bhatt & Sons','Aarav Stone Works','Mehta Developers','Pahadi Suppliers',
        'Negi Brothers','Rawat Construction','Devbhoomi Infra','Kailash Traders','Shiv Shakti Constructions',
        'Anand Brothers','Tarai Road Works','Nainital Builders','Gupta Material Supply','Joshi & Company',
        'Bisht Contractors','Uttarakhand Aggregates','Panwar Enterprises','Chauhan Traders') END,
    Caddress = 'Industrial Area, Sitarganj',
    Ccity = 'Sitarganj',
    Cphones = '98000' + RIGHT('00000' + CAST(n.rn AS varchar(5)), 5),
    Gstin = NULL, Pan = NULL, Tin = NULL
FROM Party p JOIN n ON n.ID = p.ID;

-- ---- ledgers / accounts --------------------------------------------------------------------------------
UPDATE Ledgers SET Name = 'Ledger ' + CAST(ID AS varchar(10)), City = NULL, Ph = NULL, Tin = NULL;

-- ---- vehicles and users --------------------------------------------------------------------------------
UPDATE Vehicle SET Vnumber = 'UK07CA' + RIGHT('0000' + CAST(7000 + id AS varchar(4)), 4), Gregno = NULL;

;WITH u AS (SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS rn FROM user2)
UPDATE x SET Name = CASE WHEN x.Name = 'Admin' THEN 'Admin' ELSE 'operator' + CAST(u.rn AS varchar(3)) END, Abbr = NULL
FROM user2 x JOIN u ON u.id = x.id;

-- ---- company -------------------------------------------------------------------------------------------
UPDATE CompanyProfiles SET LegalName = 'Demo Stone Industries', Address = 'Industrial Area, Sitarganj, Uttarakhand',
    Gstin = '05ABCDE1234F1Z5', Phone = '9800000000', Email = 'info@example.com';

-- ---- all transaction history ---------------------------------------------------------------------------
DELETE FROM Sale_Detail;
DELETE FROM Sale;
DELETE FROM token;
DELETE FROM tblPurchase;
DELETE FROM OutboxMessages;
DELETE FROM WeighmentImages;
DELETE FROM AuditLogs;
DELETE FROM VEntryDetail;
DELETE FROM VEntry;
BEGIN TRY DELETE FROM S_Sale_Detail; DELETE FROM S_Sale; DELETE FROM ShiftingT; END TRY BEGIN CATCH END CATCH;
BEGIN TRY DELETE FROM tmpLedger; END TRY BEGIN CATCH END CATCH;
BEGIN TRY DELETE FROM tmpPartyStatement; END TRY BEGIN CATCH END CATCH;
BEGIN TRY DELETE FROM tblExpenseLedgers; END TRY BEGIN CATCH END CATCH;
DECLARE @t sysname, @sql nvarchar(400);
DECLARE c CURSOR FOR SELECT name FROM sys.tables WHERE name LIKE '%Audit%' OR name LIKE '%LoginLog%';
OPEN c; FETCH NEXT FROM c INTO @t;
WHILE @@FETCH_STATUS = 0 BEGIN
    SET @sql = N'BEGIN TRY DELETE FROM [' + @t + N']; END TRY BEGIN CATCH END CATCH';
    EXEC (@sql);
    FETCH NEXT FROM c INTO @t;
END
CLOSE c; DEALLOCATE c;

SELECT (SELECT COUNT(*) FROM Party) AS parties, (SELECT COUNT(*) FROM Sale) AS sales, (SELECT COUNT(*) FROM token) AS tokens;
