#include "ravitaillement.h"
#include "ui_ravitaillement.h"

ravitaillement::ravitaillement(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::ravitaillement)
{
    ui->setupUi(this);
}

ravitaillement::~ravitaillement()
{
    delete ui;
}
