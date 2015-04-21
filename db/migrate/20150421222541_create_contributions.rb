class CreateContributions < ActiveRecord::Migration
  def change
    create_table :contributions do |t|
      t.text :body
      t.text :justification
      t.integer :user_id
      t.integer :document_id
      t.string :paragraph_hash

      t.timestamps null: false
    end
  end
end
