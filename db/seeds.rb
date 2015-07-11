# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

categories = [
  "Artes Integradas",
  "Artes Visuais",
  "Carnaval",
  "Cinema",
  "Circo",
  "Cultura Digital",
  "Cultura Estrangeira",
  "Cultura Indígena",
  "Cultura",
  "Infância e Juventude",
  "Cultura e Gênero",
  "Cultura e Memória",
  "Cultura Negra",
  "Cultura Popular",
  "Cultura e Educação",
  "Cultura e Religião",
  "Cultura e Justiça Social",
  "Cultura e Urbanismo",
  "Dança",
  "Fotografia",
  "Gestão Cultural",
  "Literatura",
  "Música",
  "Patrimônio Material",
  "Patrimônio Imaterial",
  "Teatro",
  "Televisão",
  "Outro"
]

categories.each {|category| Category.create name: category}
