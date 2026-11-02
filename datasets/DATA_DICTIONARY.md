# Common Experimental Dataset Data Dictionary (ECS351)

**Seed**: `42` (Deterministic Python random engine)
**Campus**: Chanakya University Global Campus, Bengaluru

### Tables & Entity Schema

| Entity | Count | Key Fields | Description |
| :--- | :--- | :--- | :--- |
| **schools** | 6 | `school_id, name, code` | 6 Chanakya University constituent academic schools |
| **departments** | 13 | `department_id, school_id, name` | Academic faculties |
| **locations** | 28 | `location_id, name, lat, lng, capacity` | Physical buildings, labs, sports fields, entrances, and walkway junctions |
| **pathways** | 32 | `pathway_id, from_id, to_id, distance, modes` | Campus graph edges with distance in meters and accessibility flags |
| **main_events** | 7 | `main_event_id, name, dates, school` | 7 flagship conclaves (Samyuti, OJAS, Sports, Workshops, Srujana, Innovation, Carnival) |
| **sub_events** | 53 | `sub_event_id, name, venue, max_capacity` | 62 technical, cultural, athletic competitions and workshops |
| **participants** | 200 | `participant_id, name, roll_number, role` | 200 student, faculty, staff, and visitor accounts |
| **registrations** | 201 | `registration_id, sub_event_id, code, qr` | Verified student-event registrations with digital passes |
| **certificates** | 201 | `certificate_id, code, rank, url` | Official digital certificates of participation and excellence |
| **campus_issues** | 24 | `issue_id, title, category, severity, status` | Infrastructure reports with AI classification and path blockage flags |
| **navigation_logs** | 150 | `navigation_id, src, dst, strategy, dist` | Historical pathfinding queries across 5 navigation strategies |
| **crowd_density** | 294 | `crowd_id, location_id, hour, density` | Hourly zone telemetry for crowd prediction and heatmaps |
