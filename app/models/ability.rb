class Ability
  include CanCan::Ability

  def initialize(user)
    can :read, Document

    if user.present?
      can :manage, Document, user_id: user.id

      if user.admin?
        can :manage, :all
      end
    end
  end
end
