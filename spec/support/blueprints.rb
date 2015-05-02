require 'machinist/active_record'

User.blueprint do
  email { "user-#{sn}@trashmail.com" }
  password { "12345678" }
  first_name { "Nícolas" }
  last_name { "Iensen" }
  api_token { "#{sn}" }
end

Document.blueprint do
  body { "<p>Lorem ipsum</p>" }
end

Contribution.blueprint do
  document { Document.make! }
  user { User.make! }
  body { "Lorem ipsum" }
  justification { "My justification" }
  paragraph_hash { "abc#{sn}" }
end
