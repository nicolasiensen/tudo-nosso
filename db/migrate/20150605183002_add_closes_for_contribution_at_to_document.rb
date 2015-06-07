class AddClosesForContributionAtToDocument < ActiveRecord::Migration
  def change
    add_column :documents, :closes_for_contribution_at, :datetime
  end
end
