import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';


export class FjahangeerCdkProjectStack extends cdk.Stack {
 constructor(scope: Construct, id: string, props?: cdk.StackProps) {
   super(scope, id, props);


   // 🔹 Create an Amazon S3 Bucket
   const FjahBucket = new s3.Bucket(this, 'CdkLabS3Bucket', {
     versioned: true,
     removalPolicy: cdk.RemovalPolicy.DESTROY,
   });


   // 🔹 Create an AWS Lambda Function
   const FjahLambda = new lambda.Function(this, 'CdkS3Lambda', {
     runtime: lambda.Runtime.NODEJS_18_X,
     handler: 'index.handler',
     code: lambda.Code.fromInline(`
       exports.handler = async function(event) {
         console.log('Lambda Function triggered!');
         return { statusCode: 200, body: 'Hello from Lambda!' };
       };
     `),
     environment: {
       S3_BUCKET: FjahBucket.bucketName,
     },
   });


   // Grant Lambda permission to read and write to the S3 bucket
   FjahBucket.grantReadWrite(FjahLambda);


   // 🔹 Create a DynamoDB Table
   const FjahDynamoTab = new dynamodb.Table(this, 'FjahDynamoTab', {
     partitionKey: { name: 'recordId', type: dynamodb.AttributeType.STRING },
     tableName: 'FjahDynamoTab',
     removalPolicy: cdk.RemovalPolicy.DESTROY,
   });


   // Output the S3 bucket name
   new cdk.CfnOutput(this, 'S3BucketNameOutput', {
     value: FjahBucket.bucketName,
   });


   // Output the DynamoDB table name
   new cdk.CfnOutput(this, 'DynamoDBTableNameOutput', {
     value: FjahDynamoTab.tableName,
   });
 }
}
