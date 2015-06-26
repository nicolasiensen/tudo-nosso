class AddBodyHtmlToDocument < ActiveRecord::Migration
  def change
    add_column :documents, :body_html, :text
  end
end
