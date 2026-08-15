# Disaster Recovery Plan

## Scenarios
1. Database failure
   - Detection: healthcheck/db errors
   - Response: failover/restore
   - Recovery: restore latest backup + WAL
   - Verification: integrity script + smoke tests

2. Server failure
   - Detection: uptime monitor
   - Response: restart/replace container
   - Recovery: redeploy immutable image
   - Verification: /health + /api/health

3. Storage failure
   - Detection: media upload failures
   - Response: switch to backup bucket
   - Recovery: sync from replica
   - Verification: checksum and sample reads

4. AI provider failure
   - Detection: AI timeout/error rate alert
   - Response: circuit breaker
   - Recovery: fallback rule-based mode
   - Verification: inference success on fallback

5. Payment provider failure
   - Detection: callback error spike
   - Response: queue callbacks and reconciliation
   - Recovery: replay verification jobs
   - Verification: payment/order consistency report
