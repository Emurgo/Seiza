import {withStateHandlers, withProps} from 'recompose'
import {compose} from 'redux'

const WithTabState = compose(
  withStateHandlers(
    ({tabNames}) => ({
      currentTab: 0,
    }),
    {
      setTab: () => (event, tabIndex) => ({
        currentTab: tabIndex,
      }),
    }
  ),
  withProps(({currentTab, tabNames}) => ({
    currentTabName: tabNames[currentTab],
  }))
)(({children, currentTab, currentTabName, setTab}) =>
  children({currentTab, currentTabName, setTab})
)

// Example usage:
// <WithTabState tabNames={['TAB_1_NAME', 'TAB_2_NAME']}>{
//   {({setTab, currentTab, currentTabName}) => {
//         <Tabs value={currentTab} onChange={setTab}>
//           <Tab ... />
//           <Tab ... />
//         </Tabs>
//         {currentTabName === 'TAB_1_NAME' && renderFirstTab}
//         {currentTabName === 'TAB_2_NAME' && renderSecondTab}
//   }}
// </WithTabState>
export default WithTabState
