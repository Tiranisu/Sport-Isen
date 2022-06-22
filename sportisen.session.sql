-- SELECT * FROM users WHERE access_token='59a920215799e3a8db0edc5fa6cc012adb1fc504179abd6010615b5194ba83dc'
UPDATE matchs SET date_time='2022-04-24 10:00' WHERE id=1
-- UPDATE matchs SET score=NULL, best_player_id=NULL WHERE id=1
-- SELECT m.id, m.name, s.name as sport_name, a.name as stade_name, a.street, a.city, m.nb_player_min, m.nb_player_max, m.date_time, m.duration, m.price, p.user_id, m.score, m.best_player_id, u.firstname, u.lastname FROM matchs m, sports s, address a, participant p, users u WHERE m.sport_id=s.id AND m.address_id=a.id AND p.user_id=1 AND m.id = p.match_id AND m.best_player_id = u.id
-- SELECT m.id, m.name, s.name as sport_name, a.name as stade_name, a.street, a.city, m.nb_player_min, m.nb_player_max, m.date_time, m.duration, m.price, p.user_id, m.score, m.best_player_id FROM matchs m, sports s, address a, participant p WHERE m.sport_id=s.id AND m.address_id=a.id AND p.user_id=1 AND m.id = p.match_id
