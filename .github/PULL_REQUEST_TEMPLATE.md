# Docker Image Release PR Template

## Release Checklist

Before merging, ensure all items are completed:

### Image Size
- [ ] Image size before: _____ MB
- [ ] Image size after: _____ MB
- [ ] Size change: _____ MB (+/-)

### Supply Chain Hygiene
- [ ] SBOM generated: [Link to sbom.spdx.json]
- [ ] Vulnerability scan results: [Link to scan results]
- [ ] Critical vulnerabilities: _____
- [ ] High vulnerabilities: _____

### Healthcheck Decision
- [ ] Healthcheck enabled: Yes/No
- [ ] If yes, configuration: _____
- [ ] If no, reason: _____

### Smoke Test Evidence
- [ ] Health endpoint response: `curl -fsS http://localhost:3000/health` ✅
- [ ] Non-root user verification: `docker run --rm app:local sh -lc 'id -u && id -g'` ✅
- [ ] Prisma client verification: `docker run --rm app:local node -e "require('@prisma/client'); console.log('ok')"` ✅

### Deployment Validation
- [ ] Database migrations applied successfully
- [ ] Environment variables validated
- [ ] Rollout to staging successful
- [ ] Rollout to production successful

## Changes Summary

Briefly describe the changes in this release:

## Testing Performed

List the testing performed for this release:

## Rollback Plan

Steps to rollback this release if needed:

## Notes

Any additional notes or considerations: