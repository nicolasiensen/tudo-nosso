class AddCategoryIdToDocument < ActiveRecord::Migration
  def change
    add_column :documents, :category_id, :integer
  end
end
