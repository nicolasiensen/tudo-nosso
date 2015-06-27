class RemoveBodyHtmlFromDocument < ActiveRecord::Migration
  def change
    remove_column :documents, :body_html, :text
  end
end
