# Arquitetura do Projeto NodeNotify usando Python Diagrams

from diagrams import Diagram, Cluster, Edge
from diagrams.aws.compute import Lambda
from diagrams.aws.storage import S3
from diagrams.aws.integration import SNS
from diagrams.aws.network import APIGateway
from diagrams.aws.security import IAMRole
from diagrams.aws.database import Dynamodb
from diagrams.aws.management import Cloudwatch
from diagrams.aws.general import User

with Diagram("Arquitetura NodeNotify", show=False, direction="TB"):
    user = User("Usuário Final")

    with Cluster("AWS Cloud"):
        # Recursos principais dentro do ambiente AWS
        s3_bucket = S3("Bucket S3 NodeNotify")
        lambda_function = Lambda("Lambda NodeNotify")
        sns_topic = SNS("Tópico SNS")
        cloudwatch = Cloudwatch("Logs CloudWatch")
        iam_role = IAMRole("Role Lambda - Permissões")

        # Fluxo da arquitetura
        user >> Edge(color="blue", label="Upload de Arquivo") >> s3_bucket
        s3_bucket >> Edge(color="green", label="Evento: Novo Arquivo") >> lambda_function
        lambda_function >> Edge(color="orange", label="Publicar Notificação") >> sns_topic
        lambda_function >> Edge(color="purple", label="Gerar Logs") >> cloudwatch
        iam_role >> Edge(color="red", style="dashed", label="Permissões para Lambda acessar S3 e SNS") >> lambda_function