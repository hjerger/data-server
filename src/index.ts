import express, { Request, Response } from "express"
import cors from "cors"
import Database from "better-sqlite3"

const PORT = process.env.PORT || 3030
const DB_FILE = process.env.DB_FILE || "./findings.db"

const db = new Database(DB_FILE) //, { verbose: console.log })
db.pragma("journal_mode = WAL")

const getRaw = db.prepare("SELECT * FROM raw_findings")
const getGrouped = db.prepare("SELECT * FROM grouped_findings")
const getRawById = db.prepare(
  "SELECT * FROM raw_findings WHERE grouped_finding_id = ?"
)
const getGroupedSeverityCount = db.prepare(
  "SELECT severity, COUNT(*) AS count FROM grouped_findings GROUP BY severity ORDER BY count desc"
)
const getGroupedAnalystCount = db.prepare(
  "SELECT security_analyst, COUNT(*) AS count FROM grouped_findings GROUP BY security_analyst ORDER BY count desc"
)

const app = express()
app.use(express.json())
app.use(cors())

app.get("/findings/raw", (req: Request, res: Response) => {
  res.json(getRaw.all())
})

app.get("/findings/rawByGroup/:id", (req: Request, res: Response) => {
  res.json(getRawById.all(req.params.id))
})

app.get("/findings/grouped", (req: Request, res: Response) => {
  res.json(getGrouped.all())
})

app.get("/findings/groupedSeverityCount", (req: Request, res: Response) => {
  res.json(getGroupedSeverityCount.all())
})

app.get("/findings/getGroupedAnalystCount", (req: Request, res: Response) => {
  res.json(getGroupedAnalystCount.all())
})

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Data Server" })
})

const server = app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`)
})

export default server
