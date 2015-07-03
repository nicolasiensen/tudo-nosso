require 'machinist/active_record'

User.blueprint do
  email { "user-#{sn}@trashmail.com" }
  password { "12345678" }
  first_name { "Nícolas" }
  last_name { "Iensen" }
  api_token { "#{sn}" }
end

Document.blueprint do
  user
  category { Category.make! }
  body { "<p>Lorem ipsum</p>" }
  closes_for_contribution_at { 10.days.from_now }
  title { "Document #{sn}" }
end

Contribution.blueprint do
  document { Document.make! }
  user { User.make! }
  body { "Lorem ipsum" }
  justification { "My justification" }
  paragraph_hash { "abc#{sn}" }
end

Upvote.blueprint do
  user { User.make! }
  contribution { Contribution.make! }
end

ParagraphUpvote.blueprint do
  user { User.make! }
  document { Document.make! }
  paragraph_hash { "123" }
end

Category.blueprint do
  name { "Category #{sn}" }
end
