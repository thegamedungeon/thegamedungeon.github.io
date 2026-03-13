// Function to create the custom (email:unlock) format
function createDuntextEntry(email, days) {
    let unlock;
    if (days == 0) {
        unlock = "NULL";
    } else {
        let d = new Date();
        d.setDate(d.getDate() + parseInt(days));
        // Formats to YYYY-MM-DD HH:MM:SS
        unlock = d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    }
    return `(${email}:${unlock})`;
}

// Function to check if a user is currently blicked
async function checkDungeonStatus(email) {
    try {
        const response = await fetch('/storage/dungeonban/allbans.duntext');
        const data = await response.text();
        
        // Search for the specific user in the .duntext file
        const regex = new RegExp(`\\(${email}:(.*?)\\)`);
        const match = data.match(regex);

        if (match) {
            const unlockVal = match[1];
            if (unlockVal === "NULL") return { banned: true, type: "PERMANENT" };

            const unlockDate = new Date(unlockVal);
            const now = new Date();

            if (now < unlockDate) {
                return { banned: true, type: "TEMPORARY", date: unlockVal };
            }
        }
        return { banned: false };
    } catch (e) {
        console.log("No ban file found or error reading .duntext");
        return { banned: false };
    }
    }
