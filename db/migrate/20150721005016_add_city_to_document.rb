class AddCityToDocument < ActiveRecord::Migration
  def change
    add_column :documents, :city, :string
  end
end
