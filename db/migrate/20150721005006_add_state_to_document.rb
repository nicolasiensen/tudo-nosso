class AddStateToDocument < ActiveRecord::Migration
  def change
    add_column :documents, :state, :string
  end
end
