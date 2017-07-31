Rails.application.routes.draw do

  root to: 'static_pages#index'

  namespace :api, default: {format: :json} do
    resources :pages, only: [:create]
  end
end
