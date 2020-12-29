/* eslint-disable */
import { Builder, By, until, Capabilities } from 'selenium-webdriver';
import WorkLog from './WorkLog';

async function run(store, http, username) {
  // let driver = null;
  // try {
  //   store.dispatch('addWorkLog', new WorkLog(1, 'success', '', 'GetProfileData', 'start'));
  //   const chromeCapabilities = Capabilities.chrome();
  //   chromeCapabilities.set('chromeOptions', {
  //     'args': [
  //       '--headless',
  //     ],
  //   });
  //   driver = await new Builder().forBrowser('chrome').withCapabilities(chromeCapabilities).build();
  //   const cookies = store.state.instagram.account[store.state.instagram.loginId].cookie;
  //   const date = new Date().toLocaleDateString();
  //   for (const accountId of Object.keys(store.state.instagram.account)) {
  //     try {
  //       const account = store.state.instagram.account[accountId];
  //       if (account.username) {
  //         await driver.get(`https://www.instagram.com/${account.username}/?hl=ko`);
  //         await driver.wait(until.elementLocated(By.xpath(`//h1[contains(text(), "${account.username}")]`)), 10000);
  //         const profile = await driver.executeScript('return _sharedData.entry_data.ProfilePage[0].graphql.user');
  //         if (!(profile.edge_followed_by.count === 0 && profile.edge_follow.count === 0 && profile.edge_owner_to_timeline_media.count === 0)) {
  //           http.post('/api/instagram/log/account', {
  //             email: account.id,
  //             date,
  //             follower: profile.edge_followed_by.count,
  //             following: profile.edge_follow.count,
  //             board: profile.edge_owner_to_timeline_media.count,
  //           });
  //           store.dispatch('setAccountLogs', {
  //             id: account.id,
  //             value: {
  //               board: profile.edge_owner_to_timeline_media.count,
  //               follower: profile.edge_followed_by.count,
  //               following: profile.edge_follow.count,
  //             },
  //           });
  //         }
  //       }
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   }

  //   await driver.get(`https://www.instagram.com/${username}/?hl=ko`);
  //   await driver.wait(until.elementLocated(By.xpath(`//h1[contains(text(), "${username}")]`)), 10000);
  //   const data = await driver.executeScript('return _sharedData.entry_data.ProfilePage[0].graphql.user');
  //   await driver.quit();
  //   store.dispatch('addWorkLog', new WorkLog(1, 'success', '', 'GetProfileData', `end_${(data) ? 'true' : 'false'}`));
  //   return data;
  // } catch(e) {
  //   console.log(e);
  //   store.dispatch('addWorkLog', new WorkLog(2, 'error', '', 'GetProfileData', e));
  //   await driver.quit();
  //   return null;
  // }
}

export default run;
