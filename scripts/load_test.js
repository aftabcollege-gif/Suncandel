import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 20,
  duration: "30s",
  thresholds: {
    http_req_failed: ["rate<0.02"],
    http_req_duration: ["p(95)<600"],
  },
};

export default function () {
  const res = http.get("http://localhost:3000/health");
  check(res, {
    "status is 200 or 503": (r) => r.status === 200 || r.status === 503,
  });
  sleep(1);
}
