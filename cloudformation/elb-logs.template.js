import cf from '@openaddresses/cloudfriend';

export default cf.merge({
    Description: 'Template for @tak-ps/elb-logs',
    Parameters: {
        GitSha: {
            Description: 'GitSha that is currently being deployed',
            Type: 'String'
        },
    },
    Resources: {
        LogBucket: {
            Type: 'AWS::S3::Bucket',
            Properties: {
                BucketName: cf.join('-', [cf.stackName, cf.accountId, cf.region]),
            }
        }
    },
});
