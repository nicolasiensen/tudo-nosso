class RenameTerritoryFromDocument < ActiveRecord::Migration
  def change
    rename_column :documents, :territory, :scope
  end
end
