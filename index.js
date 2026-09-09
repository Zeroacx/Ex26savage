const simpleGit = require("simple-git");
const moment = require("moment");
const jsonfile = require("jsonfile");

const git = simpleGit();
const path = "./data.json";

const START_DATE = "2026-01-01";
const END_DATE = "2026-08-31";

async function makeCommit(date, count) {
    for (let i = 0; i < count; i++) {
        const data = {
            date: date,
            commit: i
        };

        jsonfile.writeFileSync(path, data);

        await git.add([path]);

        await git.commit(
            `Update ${date} #${i + 1}`,
            {
                "--date": `${date}T12:00:00`
            }
        );
    }
}

async function main() {
    await git.init();

    let date = moment(START_DATE);
    const end = moment(END_DATE);

    while (date.isSameOrBefore(end, "day")) {
        /*
         * Number of commits for this day.
         * Change this if you want a different pattern.
         */
        const count = Math.floor(Math.random() * 5);

        if (count > 0) {
            console.log(`${date.format("YYYY-MM-DD")} -> ${count} commits`);
            await makeCommit(date.format("YYYY-MM-DD"), count);
            
        }

        date.add(1, "day");
    }

    console.log("Finished.");
}

main().catch(console.error);
