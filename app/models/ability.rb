class Ability
  include CanCan::Ability

  def initialize(user)
    can :read, Document

    if user.present?
      can :manage, Document, user_id: user.id
    end
  end
end
