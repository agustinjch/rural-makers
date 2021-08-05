import React from 'react'
import PropTypes from 'prop-types'
import { Card, Statistic, Grid, Header } from 'semantic-ui-react'
import { FlowRouter } from 'meteor/kadira:flow-router'
import PageHeader from '../components/admin/PageHeader'
import Loading from '../components/utils/Loading'

export default function DashboardPage(props) {
  console.log('dash page')
  const { loading, counters } = props
  return (
    <div>
      <PageHeader title="Home" />
      <section className="content">
        {loading ? (
          <Loading />
        ) : (
          <Grid>
            <Grid.Row>
              <Grid.Column>
                <Header as="h3">Counters</Header>
                <Card.Group>
                  {counters.map(counter => (
                    <Card
                      key={counter.name}
                      href={FlowRouter.path(`Admin.${counter.name}`)}
                    >
                      <Statistic
                        size="small"
                        value={counter.count.toString()}
                        label={counter.name}
                      />
                    </Card>
                  ))}
                </Card.Group>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        )}
      </section>
    </div>
  )
}

DashboardPage.propTypes = {
  counters: PropTypes.instanceOf(Array),
  loading: PropTypes.bool
}

DashboardPage.defaultProps = {
  counters: [],
  loading: true
}
