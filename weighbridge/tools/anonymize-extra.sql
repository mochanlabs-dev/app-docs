-- Second pass over the demo DB, run AFTER seed-demo.mjs: collapse duplicate invented party names and neutralise
-- material names/rates that came from the real database, so the screenshots show a clean, generic catalogue.
SET NOCOUNT ON; SET QUOTED_IDENTIFIER ON;

;WITH used AS (
    SELECT party AS id FROM token WHERE party IS NOT NULL
    UNION SELECT Partyid FROM tblPurchase WHERE Partyid IS NOT NULL
    UNION SELECT TransportPartyId FROM Sale WHERE TransportPartyId IS NOT NULL
), ranked AS (
    SELECT p.ID, ROW_NUMBER() OVER (PARTITION BY p.CName ORDER BY CASE WHEN p.ID IN (SELECT id FROM used) THEN 0 ELSE 1 END, p.ID) AS rn,
           CASE WHEN p.ID IN (SELECT id FROM used) THEN 1 ELSE 0 END AS isUsed
    FROM Party p WHERE p.IsDeleted = 0
)
UPDATE p SET IsDeleted = 1 FROM Party p JOIN ranked r ON r.ID = p.ID WHERE r.rn > 1 AND r.isUsed = 0;

UPDATE Product SET ProName = 'BOULDER STOCK' WHERE ProName LIKE 'BOLDER GAJROLA%';
UPDATE Product SET ProName = 'RBM STOCK'     WHERE ProName LIKE 'RBM GAJROLLA%';
UPDATE Product SET ProName = 'RBM FINE'      WHERE ProName LIKE 'RBM MADAIYA%';
UPDATE Product SET ProName = 'SCRAP'         WHERE ProName LIKE 'old scrap%';

SELECT (SELECT COUNT(*) FROM Party WHERE IsDeleted = 0) AS parties, (SELECT COUNT(DISTINCT CName) FROM Party WHERE IsDeleted = 0) AS distinctNames;

-- ---- camera credentials / addresses, Tally company: replace with obvious placeholders
UPDATE CameraDeviceSettings SET Host = CASE Position WHEN 'Bottom' THEN '192.168.1.64' WHEN 'Front' THEN '192.168.1.65'
                                                     WHEN 'Rear' THEN '192.168.1.66' ELSE '192.168.1.67' END,
                                Username = 'admin', Password = 'change-me';
UPDATE TallySettings SET CompanyName = 'Demo Stone Industries', Gstin = '05ABCDE1234F1Z5',
                         SalesLedgerName = 'Sales', PurchaseLedgerName = 'Purchase', GstLedgerName = 'GST';
UPDATE UserClass SET Name = 'Administrator' WHERE Name = 'Adminstrator';
UPDATE UserClass SET IsDeleted = 1 WHERE Name IN ('TEST_ROLE', 'ClaudeVerifyRole');
UPDATE UserClass SET Name = 'Operator' WHERE Name = 'OPERATOR';
UPDATE SlipLayoutSettings SET CopiesPerPage=2, PaperFormat='A4', WeightUnitLabel='Qtl', FooterNote=NULL, InvoiceTagline='Crushed stone, sand and aggregates';
UPDATE user2 SET Name='operator1' WHERE Name='operator5';
