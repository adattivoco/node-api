const debug = require('debug')('adattivo:service:schedule')

const checkCampaigns = () => {
  debug('scheduler initializing')
  // if (process.env.CHECK_CAMPAIGNS != 'false') {
  //   const interval = process.env.CHECK_CAMPAIGNS_INTERVAL || 300000
  //   debug(`checkCampaigns scheduled for every ${interval} millis`)
  //   setInterval(function() {
  //     debug(`checking campaigns`)
  //     Campign.find({}).then(function(campaigns){
  //       return Promise.map(campaigns, (campaign) => {
  //         return campaign.checkStatus(true)
  //       })
  //     })
  //   }, parseInt(interval))
  // } else {
  //     debug(`checkCampaigns not scheduled`)
  // }
  debug('scheduler started')
  return Promise.resolve()
}

export default checkCampaigns
