import React from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb, Header, Divider } from 'semantic-ui-react';

export default function PageHeader(props) {
    const { title, subTitle } = props;
    return (
        <section className="content-header">
            <Breadcrumb>
                <Breadcrumb.Section href="/">Dashboard</Breadcrumb.Section>
                <Breadcrumb.Divider icon="right angle" />
                <Breadcrumb.Section>
                    {subTitle ? (
                        <a href={`/${title.toLowerCase()}`}>{title}</a>
                    ) : (
                        <span>{title}</span>
                    )}
                </Breadcrumb.Section>
                {subTitle ? (
                    <span>
                        <Breadcrumb.Divider icon="right angle" />
                        <Breadcrumb.Section active>{subTitle}</Breadcrumb.Section>
                    </span>
                ) : (
                    ''
                )}
            </Breadcrumb>
            <Header as="h1">{subTitle || title}</Header>
            <Divider />
        </section>
    );
}

PageHeader.defaultProps = {
    title: 'Title',
    subTitle: null
};

PageHeader.propTypes = {
    // current meteor user
    title: PropTypes.string,
    subTitle: PropTypes.string
};
