INSERT INTO content.pumpkins (slug, name, latin_name, description, origin, season_start, season_end, taste_profile, texture, best_for, storage_tips, nutrition)
VALUES
('hokkaido', 'Hokkaido', 'Cucurbita maxima', 'Nussiger Speisekürbis mit essbarer Schale.', 'Japan', 9, 12, '{nussig,suesslich}', '{cremig}', '{suppe,ofen}', 'Kühl und trocken lagern.', '{"kcal":63,"fiber":"2.5g"}')
ON CONFLICT DO NOTHING;

INSERT INTO content.recipes (slug, title, description, servings, prep_time_minutes, cook_time_minutes, total_time_minutes, difficulty, diet, cuisine, instructions)
VALUES
('hokkaido-suppe', 'Hokkaido-Suppe', 'Cremige Kürbissuppe für den Herbst.', 4, 10, 25, 35, 'easy', '{vegetarisch}', 'europäisch', '["Kürbis schneiden","Zwiebel anschwitzen","Alles weich kochen und pürieren"]')
ON CONFLICT DO NOTHING;
