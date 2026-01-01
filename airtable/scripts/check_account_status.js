/**

Airtable Scripting Block: Health Monitor

Verifies if a Reddit account is active or shadowbanned */

let table = base.getTable("Reddit Accounts"); let query = await table.selectRecordsAsync({fields: ["Username"]});

for (let record of query.records) { let username = record.getCellValue("Username");

try {
    // Query Reddit public profile endpoint
    let response = await fetch(`https://www.reddit.com/user/${username}/about.json`);
    
    if (response.status === 200) {
        await table.updateRecordAsync(record, {
            "Status": {name: "Active"},
            "Last Checked": new Date().toISOString()
        });
    } else if (response.status === 404) {
        await table.updateRecordAsync(record, {
            "Status": {name: "Shadowbanned/Banned"},
            "Alert Triggered": true
        });
    }
} catch (error) {
    console.error(`Error checking ${username}:`, error);
}


}