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
                LifecycleConfiguration: {
                    Rules: [{
                        Id: 'MonthlyDelete',
                        ExpirationInDays: 30,
                        Status: 'Enabled'
                    }]
                }
            }
        },
        LogBucketPolicy: {
            Type: 'AWS::S3::BucketPolicy',
            Properties: {
                Bucket: cf.ref('LogBucket'),
                PolicyDocument: {
                    Version: "2012-10-17",
                    Statement: [
                        {
                            Effect: "Allow",
                            Principal: {
                                AWS: cf.join(['arn:', cf.partition, ':iam::', cf.findInMap('ELBRegion', cf.region, 'ELBAccount'), ':root'])
                            },
                            Action: 's3:PutObject',
                            Resource: cf.join([cf.getAtt('LogBucket', 'Arn'), '/*'])
                        }
                    ]
                }
            }
        }
    },
    // This is necessary due to: https://docs.aws.amazon.com/elasticloadbalancing/latest/application/enable-access-logging.html
    Mappings: {
        ELBRegion: {
            "us-gov-east-1": {
                ELBAccount: '048591011584'
            },
            "us-gov-west-1": {
                ELBAccount: '190560391635'
            },
            "us-east-1": {
                ELBAccount: '127311923021',
            },
            "us-east-2": {
                ELBAccount: '033677994240',
            },
            "us-west-1": {
                ELBAccount: '027434742980',
            },
            "us-west-2": {
                ELBAccount: '797873946194',
            }
        }
    },
    Outputs: {
        LogBucket: {
            Description: 'ELB Log Bucket',
            Export: {
                Name: cf.join([cf.stackName, '-bucket'])
            },
            Value: cf.ref('LogBucket')
        },
    }
});
