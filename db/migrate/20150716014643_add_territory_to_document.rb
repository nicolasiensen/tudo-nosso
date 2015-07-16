class AddTerritoryToDocument < ActiveRecord::Migration
  def change
    add_column :documents, :territory, :string
  end
end
