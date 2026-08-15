# Backup & Recovery Guide

## Backup
- Full backup script: `scripts/backup_full.sh`
- Retention recommendation:
  - Daily full backup 35 days
  - Weekly archive 12 weeks

## Recovery
- Restore script: `scripts/restore_full.sh <file>`
- Post-restore check: `scripts/db_integrity_check.sh`

## RPO / RTO
- Target RPO: 15 min (with WAL/PITR in production infra)
- Target RTO: 60 min
