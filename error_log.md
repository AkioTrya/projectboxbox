##2026-05-04-ProjectBoxbox

ErrorList session 1
1. Y-axis Bug showing negative values, the formatter is treating the milliseconds value incorrectly, (INVESTIGATED)
2. PitLap spikes, the chart filter wasn't tight enough for few session of the event, example bahrain normal lap  is around 93seconds, anything beyond and above ~1200000ms is wrong (FIXED)
3. /page,tsx\dashboard, useState and toggle driver are outside the export default function Dashboard(), (FIXING URGENT)
4. const for activeDriver, and setActiveDriver have wrong syntaxes (DONE)
5. useEffect revert to last one (DONE AND FIXED TO NEWER VERSION)
6. DataTransfer.map is wrong function (DONE)
7. line component on jsx are really broken trash out the .filter thing (DONE)
8. activedriver or Drivers (DONE)

##2026-05-05-ProjectBoxbox
1. 


Future Feature
1. Additional Navbar function for Newbie, which will contain basic F1 terms and abbreviations, considering that sometimes people who just started watching or just know F1 are clueless about F1 terms, Newbie section gonna document it (IMPLEMENTED)
2. Telemtery data simplification for easier use and over UX
3. Pace distribution (IMPLEMENTED)
4. Team history and color pallette(REWORK)
5. Security patch?
6. moving from vercel to other postgres database (i havent figured this one, planning for future scale)
7. map view (ONGOING)
8. connecting the season navbar to the connected telemetry data (IMPLEMENTED)
9. refining dashboard into a personalized looks, on the first startup user will be ask on how they wanna do their dashboard, it could be they wanna look position ove tyre degradation, or they love alping so they want the dashboard alpine like (NEED REWORK)
10. telemetry education section, how to read it can how to sync what you have read into the live race making knowing telemtry a additional fun toppings while watching F1 races (IMPLEMENTED)
11. more telemetry data fetch (FINISHED THE SESSION)
12. driver filtering or grouping, timeper sector, group laps by stint, and over UI/UX update
13. research all teams history
14. revamp theme section because it didnt do much
