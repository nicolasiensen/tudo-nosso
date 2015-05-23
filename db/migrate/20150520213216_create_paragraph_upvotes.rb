class CreateParagraphUpvotes < ActiveRecord::Migration
  def change
    create_table :paragraph_upvotes do |t|
      t.string :paragraph_hash
      t.integer :user_id
      t.integer :document_id

      t.timestamps null: false
    end
  end
end
