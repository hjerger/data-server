import server from "./index"
import request from "supertest"

const test_data = [
  {
    id: 39,
    source_security_tool_name: "AWS Security Hub",
    source_security_tool_id:
      "arn:aws:securityhub:us-east-1:340199105480:subscription/aws-foundational-security-best-practices/v/1.0.0/Redshift.6/finding/286db50f-a17f-4020-a3e6-44d7ef7edf03",
    source_collaboration_tool_name: "Jira",
    source_collaboration_tool_id: "SEC-226",
    severity: "low",
    finding_created: "2022-02-15 17:12:18.326000",
    ticket_created: "2022-02-25 09:01:39.000000",
    description:
      "Redshift.6 Amazon Redshift should have automatic upgrades to major versions enabled",
    asset: "AWS::::Account:340199105480",
    status: "open",
    remediation_url:
      "https://docs.aws.amazon.com/console/securityhub/Redshift.6/remediation",
    remediation_text:
      "For directions on how to fix this issue, consult the AWS Security Hub Foundational Security Best Practices documentation.",
    grouped_finding_id: 21,
  },
]

describe("server", function () {
  afterAll(() => {
    server.close()
  })

  it("should get /", async () => {
    const res = await request(server).get("/")

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ message: "Data Server" })
  })

  it("should get /findings/rawByGroup/21", async () => {
    const res = await request(server).get("/findings/rawByGroup/21")

    expect(res.status).toBe(200)
    expect(res.body).toEqual(test_data)
  })
})
