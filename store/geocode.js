export const state = () => ({
    items: {
        features: []
    },
})

export const mutations = {
    items: (state, items) => state.items = items,
}

export const getters = {
    items: state => state.items,
}

export const actions = {
    async reverse_geocode({ commit }, params) {
        await this.$axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/' +  params.lng.toString() +',' + params.lat.toString() + '.json?access_token=pk.eyJ1IjoiZWxnZXJhcmRvIiwiYSI6ImNsOG90NjFtMzFucG0zeWw1YWRheTV5ZmYifQ.87BCgCSXpjLIHkqGsWUW7g'
).then((res) => {
            commit('items', res.data)
        })
    },
}