require 'rails_helper'

RSpec.describe DocumentsController, type: :controller do
  describe "GET show" do
    let(:document) { Document.make! }

    it "should assign the right document" do
      get :show, id: document.id
      expect(assigns(:document)).to be_eql(document)
    end
  end
end
